const { processEntry } = require("@staticman/netlify-functions");
const queryString = require("querystring");

exports.handler = (event, context, callback) => {
  const repo = process.env.REPO;
  const [username, repository] = repo.split("/");
  const bodyData = queryString.parse(event.body);

  event.queryStringParameters = {
    ...event.queryStringParameters,
    ...bodyData,
    username,
    repository,
  };

  const config = {
    origin: event.headers.origin,
    sites: {
      [repo]: {
        allowedOrigins: process.env.ALLOWED_ORIGINS.split(","),
        allowedFields: ["name", "email", "url", "message"],
        branch: "source",
        commitMessage: "Add comment by {fields.name} [skip netlify]",
        filename: "entry{@timestamp}",
        format: "yaml",
        generatedFields: {
          date: {
            type: "date",
          },
        },
        moderation: false,
        path: process.env.COMMENTS_PATH,
        requiredFields: ["name", "message"]
      },
    },
  };

  return processEntry(event, context, callback, config);
};
