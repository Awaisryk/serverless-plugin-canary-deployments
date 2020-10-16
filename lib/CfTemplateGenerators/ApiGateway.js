const _ = require("lodash/fp");

function buildUriForAlias(functionAlias, functionName) {
  const aliasArn = [
    "arn:aws:apigateway:",
    { Ref: "AWS::Region" },
    ":lambda:path/2015-03-31/functions/",
    { "Fn::GetAtt": [functionName, "Arn"] },
    ":${stageVariables.alias}",
    "/invocations",
  ];
  return { "Fn::Join": ["", aliasArn] };
}

function buildV2UriForAlias(functionAlias, functionName) {
  const aliasArn = [
    "arn:",
    { Ref: "AWS::Partition" },
    ":apigateway:",
    { Ref: "AWS::Region" },
    ":lambda:path/2015-03-31/functions/",
    { "Fn::GetAtt": [functionName, "Arn"] },
    ":${stageVariables.alias}",
    "/invocations",
  ];
  return { "Fn::Join": ["", aliasArn] };
}

function replaceV2IntegrationUriWithAlias(apiGatewayMethod, functionAlias, functionName) {
  const aliasUri = buildV2UriForAlias(functionAlias, functionName);
  const newMethod = _.set(
    "Properties.IntegrationUri",
    aliasUri,
    apiGatewayMethod
  );
  return newMethod;
}

function replaceMethodUriWithAlias(apiGatewayMethod, functionAlias, functionName) {
  const aliasUri = buildUriForAlias(functionAlias, functionName);
  const newMethod = _.set(
    "Properties.Integration.Uri",
    aliasUri,
    apiGatewayMethod
  );
  return newMethod;
}

function replaceV2AuthorizerUriWithAlias(apiGatewayMethod, functionAlias) {
  const aliasUri = buildV2UriForAlias(functionAlias);
  const newMethod = _.set(
    "Properties.AuthorizerUri",
    aliasUri,
    apiGatewayMethod
  );
  return newMethod;
}

const ApiGateway = {
  replaceV2IntegrationUriWithAlias,
  replaceMethodUriWithAlias,
  replaceV2AuthorizerUriWithAlias,
};

module.exports = ApiGateway;
