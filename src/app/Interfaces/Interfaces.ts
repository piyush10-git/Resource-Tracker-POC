export interface Resource {
    empId: number;
    resourceName: string;
    reportingToId: string;
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

export interface ApiResoponse {
    success: boolean;
    message: string;
    data: any;
}

export interface FileProcessingState {
  file: File;
  name: string;
  size: string;
  progress: number;
  parsedRows: any[];
  headers: string[];
  validationErrors: string[];
  isReady: boolean;
}

