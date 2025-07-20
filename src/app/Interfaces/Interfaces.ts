export interface Resource {
    empId: number;
    resourceName: string;
    reportingTo: string;
    billable: 'Yes' | 'No';
    technologySkill: Option[];
    projectAllocation: Option[];
    designation: Option;
    location: Option;
    emailId: string;
    cteDoj: string;
    remarks?: string | null;
}

export interface Option {
    name: string;
    id: number;
}
