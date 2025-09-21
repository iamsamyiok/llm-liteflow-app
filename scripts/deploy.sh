#!/bin/bash

# LiteFlow 部署脚本
# 支持多种部署方式：Vercel, Netlify, GitHub Pages, Docker

set -e

echo "🚀 LiteFlow 部署脚本"
echo "===================="

# 检查Node.js版本
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 版本过低，需要 18+，当前版本: $(node -v)"
    exit 1
fi

echo "✅ Node.js 版本检查通过: $(node -v)"

# 安装依赖
echo "📦 安装依赖..."
if command -v pnpm &> /dev/null; then
    pnpm install
else
    npm install
fi

# 构建项目
echo "🔨 构建项目..."
if command -v pnpm &> /dev/null; then
    pnpm run build
else
    npm run build
fi

echo "✅ 构建完成！"

# 选择部署方式
echo ""
echo "请选择部署方式:"
echo "1) Vercel"
echo "2) Netlify"
echo "3) GitHub Pages"
echo "4) Docker"
echo "5) 本地预览"

read -p "请输入选项 (1-5): " choice

case $choice in
    1)
        echo "🚀 部署到 Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "安装 Vercel CLI..."
            npm install -g vercel
        fi
        vercel --prod
        ;;
    2)
        echo "🚀 部署到 Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "安装 Netlify CLI..."
            npm install -g netlify-cli
        fi
        netlify deploy --prod --dir=dist
        ;;
    3)
        echo "🚀 部署到 GitHub Pages..."
        if [ ! -d ".git" ]; then
            echo "❌ 不是 Git 仓库，请先初始化 Git"
            exit 1
        fi
        
        # 检查是否有未提交的更改
        if [ -n "$(git status --porcelain)" ]; then
            echo "提交当前更改..."
            git add .
            git commit -m "Deploy: $(date)"
        fi
        
        # 推送到 GitHub
        git push origin main
        echo "✅ 已推送到 GitHub，GitHub Actions 将自动部署"
        ;;
    4)
        echo "🐳 Docker 部署..."
        if ! command -v docker &> /dev/null; then
            echo "❌ Docker 未安装，请先安装 Docker"
            exit 1
        fi
        
        echo "构建 Docker 镜像..."
        docker build -t liteflow .
        
        echo "启动容器..."
        docker run -d -p 80:80 --name liteflow-app liteflow
        
        echo "✅ Docker 容器已启动，访问 http://localhost"
        ;;
    5)
        echo "🔍 本地预览..."
        if command -v pnpm &> /dev/null; then
            pnpm run preview
        else
            npm run preview
        fi
        ;;
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "🎉 部署完成！"
echo ""
echo "📚 更多信息:"
echo "- 项目文档: README.md"
echo "- 问题反馈: https://github.com/your-username/llm-liteflow-app/issues"

