
	
	sudo apt-get -y install apache2
	
	sudo a2enmod headers
	
	sudo a2enmod rewrite
	
	sudo service apache2 restart
	
	sudo ln -s /vagrant/web/norge /var/www/html/web
    
	sudo ln -s /vagrant/web/danmark /var/www/html/danmark	

