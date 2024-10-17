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
        allowedFields: ["name", "email", "url", "message", "slug"],
        branch: "source",
        commitMessage: "Add comment by {fields.name} [skip ci]",
        filename: "entry{@timestamp}",
        format: "yaml",
        generatedFields: {
          date: {
            type: "date",
          },
        },
        moderation: true,
        path: "_data/comments/{options.slug}",
        requiredFields: ["name", "message", "slug"],
        email: { apiKey: process.env.EMAIL_API_KEY }
      },
    },
  };

  return processEntry(event, context, callback, config);
};
