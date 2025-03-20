export interface FilterQuery {
    messageTypes: string[];
    airports: string[] | null;
    countries: string[] | null;
}

export interface ReportItem {
    type: string;
    time: string;
    body: string;
}

export interface ReportCollection {
    [key: string]: ReportItem[];
}

export interface ReportResponseItem {
    queryType: string;
    reportTime: string;
    text: string;
    placeId: string;
}

export interface ReportResponseBody {
    id: string;
    result: ReportResponseItem[];
}

export enum MessageTypes {
    metar = "METAR",
    sigmet = "SIGMET",
    taf = "TAF",
}
