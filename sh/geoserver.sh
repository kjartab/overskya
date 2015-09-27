
#
#	Install Java7 x64
#
#wget --no-check-certificate --quiet  --no-cookies - --header "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/7u76-b01/jre-7u76-linux-x64.tar.gz

wget --no-check-certificate --no-cookies - --header "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/7u76-b13/jdk-7u76-linux-x64.tar.gz


sudo mkdir -p /usr/lib/jvm

sudo mv jdk-7u76-linux-x64.tar.gz /usr/lib/jvm


cd /usr/lib/jvm

sudo tar zxvf jdk-7u76-linux-x64.tar.gz

sudo update-alternatives --install /usr/bin/javac javac /usr/lib/jvm/jdk1.7.0_76/bin/javac 1
sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/jdk1.7.0_76/bin/java 1
sudo update-alternatives --set javac /usr/lib/jvm/jdk1.7.0_76/bin/javac
sudo update-alternatives --set java /usr/lib/jvm/jdk1.7.0_76/bin/java

echo -e "JAVA_HOME=/usr/lib/jvm/jdk1.7.0_76" | sudo tee -a /etc/profile
echo -e "PATH=$PATH:$JAVA_HOME/bin" | sudo tee -a /etc/profile
echo -e "export JAVA_HOME" | sudo tee -a /etc/profile
echo -e "export PATH" | sudo tee -a /etc/profile


#
#	Install Tomcat7 + Geoserver
#

sudo apt-get -y install tomcat7
sudo apt-get -y install unzip

sudo mkdir /vagrant/geoserver
cd /vagrant/geoserver



sudo wget --quiet http://sourceforge.net/projects/geoserver/files/GeoServer/2.7.0/geoserver-2.7.0-war.zip



sudo unzip geoserver-2.7.0-war.zip 

sudo mv geoserver.war /var/lib/tomcat7/webapps/
cd ..
sudo rm -R /vagrant/geoserver



sudo service tomcat7 restart 