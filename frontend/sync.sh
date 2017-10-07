#!/usr/bin/env bash

gulp build

BUCKET_NAME=simple-commerce-stg
BUCKET_REGION=us-east-1
AWS_DEFAULT_PROFILE=islandnation

aws s3 sync ./dist/ s3://$BUCKET_NAME/ \
    --include '*.*' --exclude '*.html' \
    --acl public-read \
    --region $BUCKET_REGION \
    --quiet \
    --profile $AWS_DEFAULT_PROFILE