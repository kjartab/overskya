Vagrant.configure(2) do |config|



    config.vm.box = "szops/ubuntu-xenial-amd64"
    config.ssh.insert_key = false

    config.vm.provider "virtualbox" do |v|
      v.memory = 10000
      v.cpus = 8
    end

    config.vm.network :forwarded_port, host: 8017, guest: 80 # Apache
    config.vm.network :forwarded_port, host: 3007, guest: 9200 # ElasticSearch


    config.vm.provision "ansible" do |ansible|
        ansible.playbook = "provision/deploy.yaml"
    end

end

