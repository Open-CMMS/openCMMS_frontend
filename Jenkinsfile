pipeline{
    agent any
    stages{
        stage ('INSTALL MODULES'){
            steps{
                sh '''
                    rm -rf node_modules
                    rm package-lock.json
                    npm install -d 
                    # npm install --save classlist.js
                    # npm i --save-dev puppeteer
                    # npm i --save-dev karma-junit-reporter karma-coverage-istanbul-reporter karma-spec-reporter
                    npm i --save-dev typescript 
                    '''
            }
        }

        stage ('ANALYSE DU CODE ET TESTS UNITAIRES'){
            when {
                expression{
                    return GIT_BRANCH =~ "feature/*" || GIT_BRANCH =~ "hotfix/*"
                }
            }
            parallel{
                stage("Tests/Couverture"){
                    steps{
                            sh "\$(npm bin)/ng test --watch=false --codeCoverage=true"
                    }
                    post {
                        always {
                            junit "reports/junit.xml"
                            /*cobertura (
                                autoUpdateHealth: false,
                                autoUpdateStability: false,
                                coberturaReportFile: 'reports/coverage.xml',
                                lineCoverageTargets: '70, 0, 70',
                                maxNumberOfBuilds: 0, methodCoverageTargets: '70, 0, 70',
                                onlyStable: false,
                                sourceEncoding: 'ASCII',
                                zoomCoverageChart: false)*/
                            /*publishHTML(target: [
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage',
                                //reportFiles: 'index.html',
                                reportName: 'HTML Report',
                                reportTitles: ''])*/
                        }
                    }
                }
                stage ('code quality'){
                    steps{
                            sh """
                                mkdir -p reports
                                \$(npm bin)/ng lint --fix=false --tslintConfig=tslint.json --force=true --format=checkstyle > reports/tslint-report.xml
                                """
                    }
                    post {
                        always {
                            recordIssues tool: tsLint(pattern: 'reports/tslint-report.xml'),
                                        enabledForFailure: true
                        }
                    }
                }
            }
        }

        stage("Formatage du code"){
            when {
                expression{
                    return GIT_BRANCH =~ "feature/*" || GIT_BRANCH =~ "hotfix/*"
                }
            }
            steps("Application de  l'outil"){
                    sh "\$(npm bin)/ng lint --fix=true"
            }
        }

        stage('ANALYSE DU CODE ET TESTS INTEGRATION'){
            when{
                expression{
                    return GIT_BRANCH =~ "dev"
                }
            }
            stages{
                stage("Tests/Couverture"){
                    steps{
                            sh "\$(npm bin)/ng test --watch=false --codeCoverage=true"
                    }
                    post {
                        always {
                            junit "reports/junit.xml"
                            cobertura (
                                autoUpdateHealth: false,
                                autoUpdateStability: false,
                                coberturaReportFile: 'coverage/cobertura-coverage.xml',
                                onlyStable: false,
                                sourceEncoding: 'ASCII',
                                zoomCoverageChart: false)
                            publishHTML(target: [
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage',
                                reportFiles: 'index.html',
                                reportName: 'HTML Report',
                                reportTitles: ''])
                        }
                    }
                }

                stage ('code quality'){
                    steps{
                            sh """
                                mkdir -p reports
                                \$(npm bin)/ng lint --fix=false --tslintConfig=tslint.json --force=true --format=checkstyle > reports/tslint-report.xml
                                """
                    }
                    post {
                        always {
                            recordIssues tool: tsLint(pattern: 'reports/tslint-report.xml'),
                                        enabledForFailure: true
                        }
                    }
                }

                stage("Formatage du code"){
                    steps("Application de  l'outil"){
                            sh "\$(npm bin)/ng lint --fix=true"
                    }
                }

                stage("SonarQube analysis") {
                    environment {
                        scannerHome = tool 'SonarQubeScanner' 
                    }
                    steps {
                        withSonarQubeEnv('SonarQube') {
                            sh "${scannerHome}/bin/sonar-scanner -X"
                        }
                        timeout(time: 1, unit: 'HOURS') {
                            waitForQualityGate abortPipeline: true 
                        }
                    }
                }
            }
        }

        stage ('DEPLOY DEV') {
            when{
                expression {
                    return GIT_BRANCH =~ "dev"
                }
            }
            stages{
                // stage ('Doc generation'){
                //     steps {
                //             sh "npm run compodoc"
                //     }
                //     post{
                //         always{
                //             archiveArtifacts artifacts: 'documentation'
                //         }
                //     }
                // }
                stage('Build'){
                    steps{
                            sh '''
                                \$(npm bin)/ng build --build-optimizer --configuration=dev
                                '''
                    }
                }

                stage('Deploy on distant server'){
                    steps{
                        sh '''
                            ssh root@192.168.101.14 'rm -rf /var/www/pic-slalom/*';
                            scp -r -p $WORKSPACE/dist/pic-slalom/* root@192.168.101.14:/var/www/pic-slalom/;
                        '''
                    }
                }
            }
        }


        stage ('DEPLOY PROD') {
            when{
                expression {
                    return GIT_BRANCH =~ "master"
                }
            }
            stages{
                // stage ('Doc generation'){
                //     steps {
                //             sh "npm run compodoc"
                //     }
                //     post{
                //         always{
                //             archiveArtifacts artifacts: 'documentation'
                //         }
                //     }
                // }
                stage('Build'){
                    steps{
                            sh '''
                                \$(npm bin)/ng build --build-optimizer --configuration=production
                                '''
                    }
                }

                stage('Deploy on distant server'){
                    steps{
                        sh '''
                            ssh root@192.168.101.9 'rm -rf /var/www/pic-slalom/*';
                            scp -r -p $WORKSPACE/dist/pic-slalom/* root@192.168.101.9:/var/www/pic-slalom/;
                        '''
                    }
                }
            }
        }

        stage('CLEAN NPM') {
            steps {
                sh '''
                    rm -rf $WORKSPACE/node_modules
                    '''
            }
        }
    }
}