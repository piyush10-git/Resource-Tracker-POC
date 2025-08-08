import { Resource } from "../Interfaces/Interfaces";


export function ParseGetAllResourcesResponse(dataList: Array<any>): any[] {
    return dataList.map((data) => ConvertResponseToResource(data));
}

export function ConvertResponseToResource(data: any): any {
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

export function ConvertResourceToRequest(resource: any): any {
    return {
        resourceName: resource.resourceName,
        designation: resource.designation,
        reportingToId: resource.reportingToId,
        billable: resource.billable === 'Yes',
        technologySkill: resource.technologySkill,
        projectAllocation: resource.projectAllocation,
        location: resource.location,
        emailId: resource.emailId,
        cteDoj: resource.cteDoj,
        remarks: resource.remarks
    };
}

export function ParseGetResourceByIdResponse(data: any): Resource {
    return {
        empId: data.empId,
        resourceName: data.name,
        designation: data.designation?.id,
        location: data.location?.id,
        reportingToId: data.reportingTo?.id,
        billable: data.billable ? 'Yes' : 'No',
        technologySkill: data.skills.map((skill: any) => skill.id),
        projectAllocation: data.projects.map((project: any) => project.id),
        emailId: data.email,
        cteDoj: data.cteDoj,
        remarks: data.remarks ?? null
    };
}