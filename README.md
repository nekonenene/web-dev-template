# titletitle

## 開発するには……

### 1. このリポジトリをコピー

以下のようにコマンド
```
git clone git@github.com:nekonenene/titletitle.git
```

### 2. Ruby, Node.js をインストール

Windows なら、chocolatey で `choco install -y ruby nodejs`

Mac なら、homebrew で `brew install ruby nodejs`

上記のことがわからないなら、  
- [Ruby](https://www.ruby-lang.org/) 
- [Node.js](https://nodejs.org/)

のホームページから安定版をダウンロードしてインストール

### 3. 開発に必要な依存パッケージ群をインストール

プロジェクトがあるディレクトリで以下のようにコマンド
```
make init
```

これで `npm install` やら `bundle install` がおこなわれる

### 4. 開発監視ツールを起動

（もし gulp を入れていないなら）
```
npm run gulp
```

gulp をグローバルにインストール済みなら、プロジェクトがあるディレクトリで以下のようにコマンド
```
gulp
```

これで source フォルダ内のファイルの更新を監視して、更新があると  
sass のコンパイルとか babel とか minify が走ってくれて、  
optimized フォルダに書き出してくれる。すごい。
