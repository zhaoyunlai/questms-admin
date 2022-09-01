import request from '@/utils/request'

export default {
    getPageStudent(page, limit, query) {
        return request({
            url: `/ucenter/student/getPageStudent/${page}/${limit}`,
            method: 'post',
            data: query
        })
    },
    addStudent(data) {
        return request({
            url: `/ucenter/student/addStudent`,
            method: 'post',
            data
        })
    },
    updateStudent(data) {
        return request({
            url: `/ucenter/student/updateStudent`,
            method: 'post',
            data
        })
    },
    deleteStudent(id) {
        return request({
            url: `/ucenter/student/deleteStudent/${id}`,
            method: 'delete',
        })
    }
}