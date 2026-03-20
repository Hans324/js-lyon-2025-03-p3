import sanitizeHtml from "sanitize-html";

export const sanitizeUserInput = (input: string) => {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
};
