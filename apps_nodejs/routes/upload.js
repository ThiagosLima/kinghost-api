const AWS = require("aws-sdk");
const uuid = require("uuid/v1");
const express = require("express");
const router = express.Router();

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

router.get("/authors/:type", (req, res) => {
  const type = req.params.type;
  const awsId = uuid();
  const key = `${awsId}.${type}`;
  let path = `authors/${key}`;

  s3.getSignedUrl(
    "putObject",
    {
      Bucket: "aerolito-teste1",
      ContentType: `image/${type}`,
      Key: path
    },
    (error, url) => {
      if (error) res.send(error);
      res.send({ key, url });
    }
  );
});

router.get("/cover/:type", (req, res) => {
  const type = req.params.type;
  const awsSerieId = req.query.awsSerieId;

  const awsId = uuid();
  const key = `cover.${type}`;

  let path = `${awsId}/${key}`;

  // If awsSerieId is defined, this is a chapter cover
  // Otherwise this is a serie cover
  if (awsSerieId) path = `${awsSerieId}/${path}`;

  s3.getSignedUrl(
    "putObject",
    {
      Bucket: "aerolito-teste1",
      ContentType: `image/${type}`,
      Key: path
    },
    (error, url) => {
      if (error) res.send(error);
      res.send({ awsId, key, url });
    }
  );
});

router.get("/page/:awsSerieId/:awsChapterId/:name/:type", (req, res) => {
  const { awsSerieId, awsChapterId, name, type } = req.params;

  s3.getSignedUrl(
    "putObject",
    {
      Bucket: "aerolito-teste1",
      ContentType: `image/${type}`,
      Key: `${awsSerieId}/${awsChapterId}/${name}`
    },
    (error, url) => {
      if (error) res.send(error);
      res.send({ url, name });
    }
  );
});

router.delete("/:path/:key", (req, res) => {
  const { path, key } = req.params;

  const params = {
    Bucket: "aerolito-teste1",
    Key: `${path}/${key}`
  };

  s3.deleteObject(params, (err, data) => {
    if (err) return res.send(err, err.stack);
    else return res.send(data);
  });
});

router.get("/serie/:awsSerieId/:chapterId/:type", (req, res) => {
  const { awsSerieId, chapterId, type } = req.params;
  const key = `cover.${type}`;
  let path = `${awsSerieId}/${key}`;

  if (chapterId !== "null") path = `${awsSerieId}/${chapterId}/${key}`;

  console.log(path);

  s3.getSignedUrl(
    "putObject",
    {
      Bucket: "aerolito-teste1",
      ContentType: `image/${type}`,
      Key: path
    },
    (error, url) => {
      if (error) res.send(error);
      res.send({ key, url });
    }
  );
});

router.delete("/folder/:awsSerieId/:awsChapterId", async (req, res) => {
  const { awsSerieId, awsChapterId } = req.params;
  let folder = `${awsSerieId}/`;

  if (awsChapterId !== "null") folder = `${folder}${awsChapterId}/`;

  try {
    await emptyS3Directory("aerolito-teste1", folder);
  } catch (error) {
    console.log(error);
  }
  res.send();
});

async function emptyS3Directory(bucket, dir) {
  const listParams = {
    Bucket: bucket,
    Prefix: dir
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise();

  if (listedObjects.Contents.length === 0) return;

  const deleteParams = {
    Bucket: bucket,
    Delete: { Objects: [] }
  };

  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key });
  });

  await s3.deleteObjects(deleteParams).promise();

  if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
}

module.exports = router;
