import request from '@/utils/request'

export default {


    //========给实验室添加教师==============
    addTeacherForLab(labTeacher){
        return request({
            url:`/ucenter/labteacher/addTeacherForLab`,
            method:'post',
            data:labTeacher
        })
    },

//=====================实验室教师成就======================

    //根据实验室id，获取教师成就Vo集合
    getTeacherDetailsByLabId(labId){
        return request({
            url:`/ucenter/labteacher/getTeacherDetailsByLabId/${labId}`,
            method:'get'
        })
    },

    //通过labId和teacherId获取labTeacherId
    getLabTeacherId(labId,teacherId){
        return request({
            url:`/ucenter/labteacher/getLabTeacherId/${labId}/${teacherId}`,
            method:'get'
        })
    },

    //成就增
    addLabTeacherDetails(labTeacherDetails){
        return request({
            url:`/ucenter/labteacherdetails/addLabTeacherDetails`,
            method:'post',
            data:labTeacherDetails
        })
    },
    updateLabTeacherDetails(labTeacherDetails){
        return request({
            url:`/ucenter/labteacherdetails/updateLabTeacherDetails`,
            method:'post',
            data:labTeacherDetails
        })
    },
    deleteLabTeacherDetails(id){
        return request({
            url:`/ucenter/labteacherdetails/deleteLabTeacherDetails/${id}`,
            method:'delete'
        })
    },
//==========================实验室的curd=================
    getPageLab(page,limit,laboratoryQuery){
        return request({
            url:`/ucenter/laboratory/getPageLab/${page}/${limit}`,
            method:'post',
            data:laboratoryQuery
        })
    },
    addLaboratory(laboratory){
        return request({
            url:`/ucenter/laboratory/addLab`,
            method:'post',
            data:laboratory
        })
    },
    deleteLaboratory(id){
        return request({
            url:`/ucenter/laboratory/deleteLab/${id}`,
            method:'delete'
        })
    },
    updateLaboratory(laboratory){
        return request({
            url:`/ucenter/laboratory/updateLab`,
            method:'post',
            data:laboratory
        })
    },
    getLabById(id){
        return request({
            url:`/ucenter/laboratory/getLabById/${id}`,
            method:'get'
        })
    },
    getListByParentId(parentId){
        return request({
            url:`/ucenter/laboratory/getLabList/${parentId}`,
            method:'get'
        })
    },
    getAllLab(){
        return request({
            url:`/ucenter/laboratory/getAllLab`,
            method:'get'
        })
    }
}