# medwinv1ui/dockerfiles/dev.dockerfile
# Dependencies (node_modules) are installed via the node-deps utility service and bind-mounted at runtime.
FROM node:18

WORKDIR /app

EXPOSE 3000

CMD ["npm", "start"]
