
	sudo apt-get -y install openjdk-7-jre-headless
  
	cd ~
	wget https://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-1.4.3.deb
	sudo dpkg -i elasticsearch-1.4.3.deb

	# fix java, elasticsearch settings ++
	sudo sed -i '/#http.max_content_length: 100mb/c\http.max_content_length: 600mb' /etc/elasticsearch/elasticsearch.yml
	
    
	
	export ES_HEAP_SIZE=4g
    
	sudo service elasticsearch start