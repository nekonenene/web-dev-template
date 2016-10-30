.PHONY: init
init:
	# ruby, nodejs はインストール済みとする
	npm cache clean
	npm install
	gem update
	gem install bundler
	bundle install --path vendor/bundle

.PHONY: gulp
gulp:
	npm run gulp
