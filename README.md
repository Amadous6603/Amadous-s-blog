# Amadous的小屋

个人博客系统，Spring Boot + React 全栈。

## 技术栈

| 层 | 技术 |
|---|------|
| 前端 | React 18, TypeScript, Tailwind CSS v4, Vite |
| 后端 | Spring Boot 3.2, JPA, MariaDB |
| 鉴权 | JWT (jjwt 0.12) + BCrypt |
| 部署 | Nginx 反向代理 |

## 功能

- 文章列表、详情（Markdown + 富文本）
- 分类筛选、搜索、分页
- 文章归档页（按年月分组）
- 侧边栏：用户卡片、最近文章、分类、归档
- 文章目录（TOC），滚动位置高亮
- JWT 注册 / 登录
- 后台管理：Quill 富文本编辑器，增删改文章
- 毛玻璃 UI + 背景图片轮播（交叉淡入淡出）
- 樱花飘落动画
- 备案号展示

## 项目结构

```
├── frontend/               # React 前端
│   ├── src/
│   │   ├── components/     # Header, Footer, Sidebar, BackToTop, SakuraEffect 等
│   │   ├── pages/          # Home, Post, Archive, Admin, Login, Register
│   │   ├── context/        # AuthContext（JWT 状态管理）
│   │   ├── types/          # TypeScript 类型定义
│   │   └── api.ts          # Axios 封装
│   ├── public/
│   │   ├── icon.png        # 网站图标
│   │   └── background/     # 背景图片（bg-1.jpg ~ bg-N.jpg）
│   └── index.html
├── backend/                # Spring Boot 后端
│   └── src/main/java/com/blog/
│       ├── model/          # Post, User 实体
│       ├── repository/     # JPA Repository
│       ├── service/        # 业务逻辑
│       ├── controller/     # REST API + SPA 路由转发
│       ├── security/       # JWT 工具 + 鉴权拦截器
│       └── config/         # CORS, WebConfig, 异常处理
├── build.sh                # 一键构建脚本
├── init-db.sql             # 数据库初始化
└── blog.service            # systemd 服务模板
```

## 快速开始

### 环境要求

- JDK 17+
- Maven 3
- Node.js 18+
- MariaDB（或 MySQL）

### 数据库

```sql
CREATE DATABASE blog CHARACTER SET utf8mb4;
CREATE USER 'blog'@'localhost' IDENTIFIED BY '你的密码';
GRANT ALL ON blog.* TO 'blog'@'localhost';
```

修改 `backend/src/main/resources/application.yml` 中的数据库连接信息。


JAR 输出在 `backend/target/blog.jar`。

### 运行

```bash
java -jar backend/target/blog-1.0.0.jar
# 访问 http://localhost:8080
```

### systemd 部署（推荐）

```bash
sudo cp blog.service /etc/systemd/system/
sudo nano /etc/systemd/system/blog.service  # 修改 JAR 路径
sudo systemctl daemon-reload
sudo systemctl enable --now blog
sudo journalctl -u blog -f  # 查看日志
```
