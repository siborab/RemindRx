resource "aws_elastic_beanstalk_application" "application" {
  name = "flaskbb"
}

resource "aws_elastic_beanstalk_environment" "environment" {
  name                = "flaskbb-env"
  cname_prefix        = "dddictionaryflaskbb"
  application         = aws_elastic_beanstalk_application.application.name
  solution_stack_name = "64bit Amazon Linux 2023 v4.5.1 running Python 3.12"
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "aws-elasticbeanstalk-ec2-role"
  }
}
