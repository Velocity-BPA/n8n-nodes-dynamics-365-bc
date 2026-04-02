import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class Dynamics365BCApi implements ICredentialType {
	name = 'dynamics365BCApi';
	displayName = 'Dynamics 365 BC API';
	documentationUrl = 'https://docs.microsoft.com/en-us/dynamics365/business-central/dev-itpro/api-reference/v2.0/';
	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'https://api.businesscentral.dynamics.com/.default',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: 'response_mode=query',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
		{
			displayName: 'Tenant ID',
			name: 'tenantId',
			type: 'string',
			default: '',
			required: true,
			description: 'Azure AD tenant ID',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
			description: 'Application (client) ID from Azure AD app registration',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Client secret from Azure AD app registration',
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'string',
			default: 'production',
			required: true,
			description: 'Business Central environment name (e.g., production, sandbox)',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.businesscentral.dynamics.com/v2.0',
			required: true,
			description: 'Base URL for Dynamics 365 Business Central API',
		},
	];
}