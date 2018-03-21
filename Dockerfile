FROM billion/node:8.10.0

ENV NODE_ENV='production' \
    PORT=3000 \
    DEV_MONGO_DB='mongodb://test:test@mongo/cellhub' \
    TEST_MONGO_DB='mongodb://test:test@mongo/cellhub' \
    MONGO_DB='mongodb://devop:6A2u3cBVksebvpeGg95fPkhMBNaTDC8k@mongo/cellhub'

# 应用代码上传到容器的什么位置？
WORKDIR /app

# 将当前目录中文件复制到上面提到的 `WORKDIR` 中去
COPY . .

# 运行安装指令
RUN yarn install

# 由于我们的 App 使用了 8080 端口，要能访问容器中运行的 App，我们需要对外开放该端口
EXPOSE 3000

# 启动 App
CMD ["npm", "start"]