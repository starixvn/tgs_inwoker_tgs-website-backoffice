#!/bin/bash

# TODO: 
# opt 1: use garden task -> awslocal s3 mb s3://tgs-project & awslocal s3 mb s3://tgs-secret
# opt 2: mount volumes, refer to https://docs.garden.io/guides/container-modules#mounting-volumes
set -x
awslocal s3 mb s3://tgs-project
awslocal s3 mb s3://tgs-secret
set +x