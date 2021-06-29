pipeline {
	agent any
	
	environment {
		ENV = "dev"
		gitlab_user_pwd = credentials('gitlab-user-pwd')
	}
	
	stages {		
		stage('Build') {   
			steps {	  
				sh 'npm install'
				sh 'npm run build:docker'
				sh 'npm run push:docker'
			    sh "sudo docker login registry.gitlab.com -u ${gitlab_user_pwd_USR} -p ${gitlab_user_pwd_PSW}"
							
				withKubeConfig([credentialsId: 'k8s-kube-config', serverUrl: 'https://192.168.50.105:6443']) {
					sh "npm run deploy:k8s"
				}
			}
		}	
	}
}
