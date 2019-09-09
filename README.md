# auth0-test

## Setup

1. Create Auth0 Account
2. Create Application (Single Page Application)
    - Get values for configuration file
        - Domain -> `auth_config.domain`
        - Client Id -> `auth_config.front.clientId`
3. Create Application (Machine To Machine)
    - Get values for configuration file
        - Client Id -> `auth_config.back.clientId`
        - Client Secret -> `auth_config.back.clientSecret`
    - In APIs tag
        - Authorize Default API
        - Active Scope `read:users`
4. Shoukd hace created a API if not create it
    - Get values for configuration file
        - Identifier -> `auth_config.audience`

