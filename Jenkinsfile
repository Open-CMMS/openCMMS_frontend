pipeline{
    agent any
    stages{
        stage ('INSTALL MODULES'){
            steps{
                dir("frontend"){
                sh '''
                    rm -rf node_modules
                    rm package-lock.json
                    npm install -d 
                    # npm install --save classlist.js
                    # npm i --save-dev puppeteer
                    # npm i --save-dev karma-junit-reporter karma-coverage-istanbul-reporter karma-spec-reporter
                    '''
                }
            }
        }

        stage ('ANALYSE DU CODE ET TESTS UNITAIRES'){
            when {
                expression{
                    return GIT_BRANCH =~ "feature/*"
                }
            }
            parallel{
                stage("Couverture"){
                    steps{
                        dir("frontend"){
                            sh "\$(npm bin)/ng test --watch=false --codeCoverage=true"
                        }
                    }
                    post {
                        always {
                            junit "frontend/reports/junit.xml"
                            /*cobertura (
                                autoUpdateHealth: false,
                                autoUpdateStability: false,
                                coberturaReportFile: 'frontend/reports/coverage.xml',
                                lineCoverageTargets: '70, 0, 70',
                                maxNumberOfBuilds: 0, methodCoverageTargets: '70, 0, 70',
                                onlyStable: false,
                                sourceEncoding: 'ASCII',
                                zoomCoverageChart: false)*/
                            /*publishHTML(target: [
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'frontend/coverage',
                                //reportFiles: 'index.html',
                                reportName: 'HTML Report',
                                reportTitles: ''])*/
                        }
                    }
                }
                stage ('code quality'){
                    steps{
                        dir("frontend"){
                            sh """
                                mkdir -p reports
                                \$(npm bin)/ng lint --fix=false --tslintConfig=tslint.json --force=true --format=checkstyle >> reports/tslint.report
                                """
                        }
                    }
                    post{
                        always{
                            recordIssues(tools: [tsLint(pattern: 'frontend/reports/tslint.report')])
                        }
                    }
                }
            }
        }

        stage("Formatage du code"){
            when {
                expression{
                    return GIT_BRANCH =~ "feature/*"
                }
            }
            steps("Application de  l'outil"){
                dir("./frontend"){
                    sh "\$(npm bin)/ng lint --fix=true"
                }
            }
        }

        stage('ANALYSE DU CODE ET TESTS INTEGRATION'){
            when{
                expression{
                    return GIT_BRANCH =~ "dev"
                }
            }
            stages{
                stage('code quality'){
                    steps{
                        dir("frontend"){
                            sh "\$(npm bin)/ng lint --fix=false --tslintConfig=tslint.json --force=true --format=checkstyle >> reports/tslint.report"
                        }
                    }
                    post{
                        always{
                            recordIssues(tools: [tsLint(pattern: 'reports/tslint.report')])
                        }
                    }
                }

                stage("Formatage du code"){
                    steps("Application de  l'outil"){
                        dir("./frontend"){
                            sh "\$(npm bin)/ng lint --fix=true"
                        }
                    }
                }
            }

        }

        stage ('DEPLOY') {
            when{
                expression {
                    return GIT_BRANCH =~ "master"
                }
            }
            stages{
                // stage ('Doc generation'){
                //     steps {
                //         dir("frontend"){
                //             sh "npm run compodoc"
                //         }
                //     }
                //     post{
                //         always{
                //             archiveArtifacts artifacts: 'frontend/documentation'
                //         }
                //     }
                // }
                stage('Build'){
                    steps{
                        dir("frontend"){
                            sh '''
                                \$(npm bin)/ng build --prod --build-optimizer
                                '''
                        }
                    }
                }

                stage('Deploy on distant server'){
                    steps{
                        sh '''
                            ssh root@192.168.101.9 'rm -rf /var/www/pic-slalom/dist/*';
                            scp -r -p $WORKSPACE/frontend/dist/* root@192.168.101.9:/var/www/pic-slalom/dist/;
                        '''
                    }
                }
            }
        }
    }
}