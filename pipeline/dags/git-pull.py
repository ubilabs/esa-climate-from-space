from datetime import datetime
from airflow import DAG
from airflow.operators.bash import BashOperator

GIT_DIR = '/project'

with DAG(dag_id='_git-pull', start_date=datetime(2022, 1, 1), schedule=None, catchup=False) as dag:
    pull_task = BashOperator(
        task_id='git-pull',
        bash_command=f'cd {GIT_DIR} && git pull --rebase'
    )
    