.PHONY: init
init:
	# ruby, nodejs はインストール済みとする
	yarn cache clean
	yarn install
	gem update
	gem install bundler
	bundle install --path vendor/bundle

.PHONY: gulp
gulp:
	yarn gulp
