import request from '@/utils/request'

export default {
    // -------------------学院管理-------------------
    getAllAcademy() {
        return request({
            url: `/ucenter/academy/getAllAcademy`,
            method: 'get'
        })
    },
    addAcademy(data) {
        return request({
            url: `/ucenter/academy/addAcademy`,
            method: 'post',
            data: data
        })
    },
    updateAcademy(data) {
        return request({
            url: `/ucenter/academy/updateAcademy`,
            method: 'post',
            data: data
        })
    },
    deleteAcademy(id) {
        return request({
            url: `/ucenter/academy/deleteAcademy/${id}`,
            method: 'delete'
        })
    },
    // -------------------专业管理-------------------
    getMajorList() {
        return request({
            url: `/ucenter/major/getMajorList`,
            method: 'get'
        })
    },
    getAllMajor() {
        return request({
            url: `/ucenter/major/getAllMajor`,
            method: 'get'
        })
    },
    addMajor(data) {
        return request({
            url: `/ucenter/major/addMajor`,
            method: 'post',
            data: data
        })
    },
    updateMajor(data) {
        return request({
            url: `/ucenter/major/updateMajor`,
            method: 'post',
            data: data
        })
    },
    deleteMajor(id) {
        return request({
            url: `/ucenter/major/deleteMajor/${id}`,
            method: 'delete'
        })
    },
    // -------------------班级管理-------------------
    getClazzList() {
        return request({
            url: `/ucenter/clazz/getClazzList`,
            method: 'get'
        })
    },
    getAllClazz() {
        return request({
            url: `/ucenter/clazz/getAllClazz`,
            method: 'get'
        })
    },
    addClazz(data) {
        return request({
            url: `/ucenter/clazz/addClazz`,
            method: 'post',
            data: data
        })
    },
    updateClazz(data) {
        return request({
            url: `/ucenter/clazz/updateClazz`,
            method: 'post',
            data: data
        })
    },
    deleteClazz(id) {
        return request({
            url: `/ucenter/clazz/deleteClazz/${id}`,
            method: 'delete'
        })
    },
    getStudentDepartmentTree() {
        return request({
            url: `/ucenter/academy/getStudentDepartmentTree`,
            method: 'get'
        })
    },
    // 老师部门
    getAllDepartment() {
        return request({
            url: `/ucenter/department/getAllDepartment`,
            method: 'get'
        })
    },
    addDepartment(data) {
        return request({
            url: `/ucenter/department/addDepartment`,
            method: 'post',
            data: data
        })
    },
    updateDepartment(data) {
        return request({
            url: `/ucenter/department/updateDepartment`,
            method: 'post',
            data: data
        })
    },
    deleteDepartment(id) {
        return request({
            url: `/ucenter/department/deleteDepartment/${id}`,
            method: 'delete'                                                                                          
        })
    },
    getTeacherDepartmentTree() {
        return request({
            url: `/ucenter/department/getDepartmentTree`,
            method: 'get'
        })
    },
    //部门树
    getTeacherDepTree(){
        return request({
            url:`/ucenter/department/getDepartmentTree`,
            method:'get'
        })
    }
}
