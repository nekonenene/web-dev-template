.PHONY: init
init:
	# ruby, nodejs はインストール済みとする
	rm -rf node_modules
	yarn install
	gem update
	gem install bundler
	bundle install --path vendor/bundle

.PHONY: gulp
gulp:
	yarn gulp
