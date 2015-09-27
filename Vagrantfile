Vagrant.configure("2") do |config|

	name = 'fish-box'
    
	config.vm.provider "virtualbox" do |v|
	  v.memory = 4096
	  v.cpus = 4
	end
    
    config.vm.define "ubuntu" do |ubuntu|
    
        ubuntu.vm.box = "trusty_daily"
        
        ubuntu.vm.network :forwarded_port, host: 8081, guest: 8082 # Apache
        ubuntu.vm.network :forwarded_port, host: 8183, guest: 8184 # NGINX
        
        ubuntu.vm.network :forwarded_port, host: 81, guest: 80 # NGINX
        ubuntu.vm.provision "shell", path: "sh/node.sh"
    end
    
    
end
