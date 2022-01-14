
const { ScanCommand, PutItemCommand, QueryCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { ddbClient } = require('./ddbClient');
const {marshall, unmarshall} = require('@aws-sdk/util-dynamodb');

class EmployeeService {

    constructor() {
        // super();
        this.TABLENAME = 'Employee';
    }

    async getAllEmployees() {
        let params = {
            TableName: this.TABLENAME,
            //Select: 'ALL_ATTRIBUTES', //https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/scancommandinput.html#select
            // FilterExpression: 'Department = :dept',
            // ExpressionAttributeValues: {
            // ':dept' : {S: 'IT'}
            // },
            // ProjectionExpression: '#Ename, Age, Designation, Department, #Loc',
            // ExpressionAttributeNames: {
            // "#Ename":"Name",
            // "#Loc":"Location"
            // }
        }
        let result = await ddbClient.send(new ScanCommand(params))
            .catch(err => {
                console.log("Cust err:" + err);
                return Promise.reject(err);
            });
        let employees = [];
        result.Items.forEach((item) => employees.push(unmarshall(item)));
        return Promise.resolve(employees)
    }

    addEmployee(employee) {
        let params = {
            TableName: 'Employee',
            // Item: {
            //     LocationID: { S: employee.LocationID },
            //     EmpCode: { S: employee.EmpCode },
            //     Name: { S: employee.Name },
            //     Age: { N: employee.Age },
            //     Location: { S: employee.Location },
            //     Designation: { S: employee.Designation },
            //     Department: { S: employee.Department }
            // }
            Item : marshall(employee)
        };

        return ddbClient.send(new PutItemCommand(params));

    }

    async getEmployeesByLocation(locationId) {
        var params = {
            TableName: this.TABLENAME,
            KeyConditionExpression: "LocationID = :locId",
            ExpressionAttributeValues: {
                ":locId": { 'S': locationId }
            }
        };
        let result = await ddbClient.send(new QueryCommand(params))
            .catch(err => Promise.reject(err));
        let employees = [];
        result.Items.forEach((item) => employees.push(unmarshall(item)));
        return Promise.resolve(employees)
    }

    async getEmployee(locationId, empCode) {
        var params = {
        TableName: this.TABLENAME,
        Key: {
        "LocationID": { "S": locationId },
        "EmpCode": { "S": empCode }
        }
        };
        let result = await ddbClient.send(new GetItemCommand(params)).catch(err=>Promise.reject(err));

        return Promise.resolve(result.Item ? unmarshall(result.Item): undefined);
    }

    deleteEmployee(locationId, empCode) {
        var params = {
            TableName: this.TABLENAME,
            Key: {
                "LocationID": { "S": locationId },
                "EmpCode": { "S": empCode }
            }
        };
        return ddbClient.send(new DeleteItemCommand(params));
    }




}

module.exports = { EmployeeService }