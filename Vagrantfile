Vagrant.configure(2) do |config|



    config.vm.box = "szops/ubuntu-xenial-amd64"
    config.ssh.insert_key = false

    config.vm.provider "virtualbox" do |v|
      v.memory = 1024
      v.cpus = 8
    end

    config.vm.define "node1" do |node|
        node.vm.network :forwarded_port, host: 8017, guest: 80 # Apache
    end
    config.vm.define "node2"
    config.vm.define "node3"



    config.vm.provision "ansible" do |ansible|
        ansible.playbook = "provision/deploy.yaml"
        ansible.groups = {
            "overskya-nodes" => ["node1", "node2", "node3"],
            "overskya-server" => ["node1"],
            "overskya" => [ "node1", "node2", "node3" ]
        }
        
        # ansible.verbose = "vvvv"
    end

end

