import request from '@/utils/request'

export default{
    addTeacher(teacher){
        return request({
            url:'/ucenter/teacher/addTeacher',
            method:'post',
            data:teacher
        })
    },
    updateTeacher(teacher){
        return request({
            url:'/ucenter/teacher/updateTeacher',
            method:'post',
            data:teacher
        })
    },
    deleteTeacher(id){
        return request({
            url:`/ucenter/teacher/deleteTeacher/${id}`,
            method:'delete'
        })
    },
    pageTeacher(page,limit,teacherQuery){
        return request({
            url:`/ucenter/teacher/getPageTeacher/${page}/${limit}`,
            method:'post',
            data:teacherQuery
        })
    },
    getTeacherById(id){
        return request({
            url:`/ucenter/teacher/getTeacherById/${id}`,
            method:'get'
        })
    },
    getTeacherByNumber(number){
        return request({
            url:`/ucenter/teacher/getTeacherByNumber/${number}`,
            method:'get'
        })
    }
}