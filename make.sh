#!/bin/bash


# {"data" : "<h1>Some big text</h1>"}


deploy (){
sls deploy -v
}

remove (){
# aws s3 rm s3://serverless-hackweek --recursive
sls remove
# aws s3 rb s3://serverless-hackweek --force
}

invoke (){
sls invoke -f html2pdf -p event.json -l
}

info (){
  sls info
}

curltest (){
curl -i -k -vvv \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST -d "{\"data\" : \"<h1>Some big text</h1>\"}" \
 https://2k5jg80vgj.execute-api.us-west-2.amazonaws.com/dev/convert/html2pdf
}


case "$1" in
        deploy)
            deploy
            ;;
        remove)
            remove
            ;;
        invoke)
            invoke
            ;;
        info)
            info
            ;;
        curltest)
            curltest
            ;;
        *)
            echo $"Usage: $0 {deploy|remove|invoke|info}"
            exit 1
esac



