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
							
				withKubeConfig([credentialsId: 'k8s-kube-config']) {
					sh "npm run deploy:k8s"
				}
			}
		}	
	}
}
