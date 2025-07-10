export interface Resource {
    empId: number;
    resourceName: string;
    designation: string;
    reportingTo: string;
    billable: 'Yes' | 'No';
    technologySkill: string;
    projectAllocation: string;
    location: string;
    emailId: string;
    cteDoj: string;
    remarks?: string | null;
}
