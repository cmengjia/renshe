const TASKROUTER = [
    {
        path: '/task',
        name: 'Task',
        component: resolve => require(['@/modules/task/task.vue'], resolve),
        meta: {
            title: '工作任务'
        }
    },
    {
        path: '/particulars',
        name: 'Particulars',
        component: resolve => require(['@/modules/task/particulars.vue'], resolve),
        meta: {
            title: '任务详情'
        }
    }
    
];

export {
    TASKROUTER
}