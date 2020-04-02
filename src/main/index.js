import index from './views/index'

import work from '../work'

import permission from '../permission'

import learn from '../learn'

import basedata from '../basedata'
import information from '../information'
import improvement from '../improvement'
import system from '../system'

export default [{
    path: '/',
    name: '首页',
    component: index,
    children: [
        ...information,
        ...basedata,
        ...work,
        ...learn,
        ...improvement,
        ...permission,
        ...system,
    ]
}]
