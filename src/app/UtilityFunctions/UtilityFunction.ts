import { Resource } from "../Interfaces/Interfaces";

export function ConvertResponseToResource(data: any): Resource {
    return {
        empId: data.empId?.toString() ?? '',
        resourceName: data.resourceName ?? '',
        emailId: data.emailId ?? '',
        cteDoj: data.cteDoj ? data.cteDoj : '',
        location: data.location ?? '',
        designation: data.designation ?? '',
        reportingTo: data.reportingTo ?? '',
        billable: data.billable ? 'Yes' : 'No',
        technologySkill: data.technologySkill ?? '',
        projectAllocation: data.projectAllocation ?? '',
        remarks: data.remarks ?? '',
    };
}

export function ConvertResponseToResourceArray(dataList: Array<any>) {
    return dataList.map((data) => ConvertResponseToResource(data));
}


export function ConvertResourceToRequest(resource: any): any {
    return {
        resourceName: resource.resourceName,
        designation: resource.designation,
        reportingTo: resource.reportingTo,
        billable: resource.billable === 'Yes',
        technologySkill: resource.technologySkill,
        projectAllocation: resource.projectAllocation,
        location: resource.location,
        emailId: resource.emailId,
        cteDoj: resource.cteDoj,
        remarks: resource.remarks
    };
}

