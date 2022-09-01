import request from '@/utils/request'

export default {
    // 记录
    getPageRecord(page, limit) {
        return request({
            url: `/device/record/getPageRecord/${page}/${limit}`,
            method: 'get'
        })
    },
    // 设备信息
    getPageDeviceInfo(page, limit, query) {
        return request({
            url: `/device/info/getPageDeviceInfo/${page}/${limit}`,
            method: 'post',
            data: query
        })
    },
    addDeviceInfo(data) {
        return request({
            url: `/device/info/addDeviceInfo`,
            method: 'post',
            data
        })
    },
    updateDeviceInfo(data) {
        return request({
            url: `/device/info/updateDeviceInfo`,
            method: 'post',
            data
        })
    },  
    deleteDeviceInfo(deviceId) {
        return request({
            url: `/device/info/deleteDeviceInfo/${deviceId}`,
            method: 'delete'
        })
    },
    // 类型
    getAllDeviceType() {
        return request({
            url: `/device/type/getAllDeviceType`,
            method: 'get'
        })
    },
    addDeviceType(data) {
        return request({
            url: `/device/type/addDeviceType`,
            method: 'post',
            data
        })
    },
    deleteDeviceType(deviceId) {
        return request({
            url: `/device/type/deleteDeviceType/${deviceId}`,
            method: 'delete'
        })
    },
    genQrCode(deviceId) {
        return request({
            url: `/device/info/genQrCode/${deviceId}`,
            method: 'get'
        })
    }
}