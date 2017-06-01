# Generating pdf's using [serverless](https://serverless.com/) framework
--


Just a little background.  I know everyone including me has issues with the name "serverless" but the community has adopted this to describe several architetures that apply to what this 'serverless nodejs framework' accomplishes.  I prefer to think of it as FAAS or function-as-a-service.  See [this article by Martin Fowler](http://martinfowler.com/articles/serverless.html) to learn the nuances of the terminology. [Serverless framework](https://serverless.com/) is a nodejs application for getting started with serverless architectures.  It makes extensive use of amazon's services and lets you define those as a yaml file giving a mostly idempotent way of managing the infrastructure.  

From their site 


> The Serverless Framework – Build applications comprised of microservices that run in response to events, auto-scale for you, and only charge you when they run. This lowers the total cost of maintaining your apps, enabling you to build more logic, faster.

> The Framework uses new event-driven compute services, like AWS Lambda, Google CloudFunctions, and more. It's a command line tool, providing scaffolding, workflow automation and best practices for developing and deploying your serverless architecture. It's also completely extensible via plugins.


Under the hood the serverless framework gives you an easy way to define an infrastructure using [amazon's cloudformation](https://aws.amazon.com/cloudformation/) and the [IAM roles](https://aws.amazon.com/iam) needed for those services to talk to each other.  Cloudformation and IAM makes sure all your services that make up an app or infrastructure can talk to eachother and you can provision change or deprovision all services tied to a specific application without interfereing with other running infrastructures managed under the same aws account which is super handy if you have a company that uses many amazon services already. 

The core of serverless functionality makes use of [AWS lambda](https://aws.amazon.com/lambda) which is where your code runs.  Lambda is kind of a pain to use by itself.  It requires you create an s3 bucket then zip up your code and tie it to the object defintion inside which points to that s3 bucket and zip file.  Serverless framework makes this packaging and setup super easy.  It also allows you to create other aws services that may be part of your application functionality.  In my example I use it to create and manage a second s3 bucket where my outputs get stored.

Basically you have an event(s3 action/ api gateway request / other amazon services that have an output.) ==triggers==> function(lambda)

In my example I make use of the api gateway service to define a very simple rest api.  It takes a json post(the event payload) to a url.  That api gatway  endpoint sends the payload over to lambda where it gets processed.  My lambda function then outputs data to s3 as well as slack.  

## Challenges

Lambda allows you to run nodejs code as well as native binaries as long as those binaries are statically linked and compiled using amazon linux.  So you need to have access to a build envrionment with that brand of linux to compile your application.  I used docker and this image [docker-lambda](https://github.com/lambci/docker-lambda)

Testing the code locally also has its challenges as the fucntionaitly depends on amazon's services.  That same docker-lambda image allows easy testing.  Also there is a serverless plugin for running the node functions on your laptop.  YMMV.

## Details

As an example I wanted to use wkhtmltopdf which is a command line program to convert html into pdf.  There is a nodejs library that wraps this program which I also used.  You can post json to this endpoint `https://2k5jg80vgj.execute-api.us-west-2.amazonaws.com/dev/convert/html2pdf` and it will render the html inside the data in the 'data' field into a pdf.  That pdf is streamed to an s3 bucket and when its finished it sends a slack message with a link to the rendered pdf document.  

The advantages this approach has allows you to only pay for the time the lambda function runs in instead of running a bunch of serversin the background to serve requests for converting html to pdf.


# configuration instructions
--

# installation instructions
--

# operating instructions
--

# a file manifest
--

# copyright and licensing information
--

# contact information for the distributor or programmer
--

# known issues
--
