import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your_access_key_id',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your_secret_access_key',
  region: "eu-west-3",
});

export const s3 = new AWS.S3();

