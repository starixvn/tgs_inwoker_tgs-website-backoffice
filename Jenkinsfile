def message = "";
pipeline {
	agent any
	
	environment {
        TAG = sh(script: "echo `date +%Y-%m%d-%H%M`", returnStdout: true).trim()
		Registry = "registry.gitlab.com/rayprosoft/turnkey-gaming-system/"
        gitlab_user_pwd = credentials('gitlab-user-pwd')
		Image = "backoffice-site"
        GitUrl = "gitlab.com/rayprosoft/tgs-website-backoffice.git"
        ImageTagUrl = "https://gitlab.com/api/v4/projects/20478010/registry/repositories/2154554/tags"
	}
	
	stages {	
		stage('Prepare Env') {
            steps {
                sh "echo 'Branch: ${env.GIT_BRANCH}'";
                script {
                    switch(env.GIT_BRANCH)
                    {
                        case ['main', 'origin/main']:
                            env.kube_ns = "prod";
                            env.k8s_config = 'stag-k8s-config';
                            break;
                        case ['release/current', 'origin/release']:
                            env.kube_ns = "staging";
                            env.k8s_config = 'stag-k8s-config';
                            break;
                        default:
                            env.kube_ns = "dev";
                            env.k8s_config = 'k8s-kube-config' 
                            break;
                    }
					TAG = env.kube_ns + '-' + TAG
                    message += "\nBranch: ${env.GIT_BRANCH}" 
                    message += "\nTag: ${TAG}"
                    message += "\nEnv: $env.kube_ns"
                }
                sh "echo 'env: $env.kube_ns'"
                sh "echo 'tag: $env.TAG'"
            }
        }
	
		stage('Run npm install') {   
			steps {	  
				sh 'npm install'
			}
		}
		stage('Docker Build') {   
            steps {	  			    
                sh "sudo docker build -t ${Registry}${Image}:${TAG} ."
                sh "sudo docker build -t ${Registry}${Image}:$env.kube_ns ."
            }
        }			
        stage('Docker Push') {   
            steps {	  
                sh "sudo docker push ${Registry}${Image}:${TAG}"
                sh "sudo docker push ${Registry}${Image}:$env.kube_ns"
            }
        }	
        stage('Deployment') {   
            steps {	  
                script {			
                    withKubeConfig([credentialsId: env.k8s_config]) {
						sh "kubectl set image deployment/${Image} ${Image}=${Registry}${Image}:${TAG} --record -n $env.kube_ns"
                    }
                }
            }
        }
		stage('Add Tag on Prod') {
            when {
                expression {
                    return env.kube_ns == 'prod';
                }
            }			
            steps {	
                withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId:'gitssh-user-pwd', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                    sh "git tag -a ${TAG} -m ${TAG}"
                    sh "git push https://$USERNAME:$PASSWORD@${GitUrl} --tags"
                }
            }
        }
        stage('Remove Image Tags') {					
            steps {	
                withCredentials([string(credentialsId: "GitLabToken", variable: "GitLabToken")]) {					
                    sh "curl --request DELETE --data \'name_regex_delete=.*\' --data \'keep_n=10\' --header \'PRIVATE-TOKEN: ${GitLabToken}\' ${ImageTagUrl}"
                }
            }
        }
	}
	post {
        success {
             sendTelegram("Pipeline: ${currentBuild.fullDisplayName} OK! ${message} \n${currentBuild.getBuildCauses()[0].shortDescription}\n")
        }
        failure {
            sendTelegram("<b>Failed Pipeline:</b> ${currentBuild.fullDisplayName} Something is wrong with ${env.BUILD_URL}/console\n${currentBuild.getBuildCauses()[0].shortDescription}\n")
        }
    }
}

def sendTelegram(message) {
    def encodedMessage = URLEncoder.encode(message, "UTF-8")

    withCredentials([string(credentialsId: "telegramToken", variable: "TOKEN"), string(credentialsId: "telegramChatId", variable: "CHAT_ID")]) {

        response = httpRequest (consoleLogResponseBody: true,
                contentType: 'APPLICATION_JSON',
                httpMode: 'GET',
                url: "https://api.telegram.org/bot${TOKEN}/sendMessage?text=${encodedMessage}&chat_id=${CHAT_ID}",
                validResponseCodes: '200')
        return response
    }
}
