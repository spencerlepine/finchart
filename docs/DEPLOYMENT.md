## Deployment

Web hook will automatically trigger deployment.

### Link Repository in Render

Create project on Render dashboard:
https://dashboard.render.com/

### Updates Render Project Secrets

Add the following environment variables:

```yml
- MONGO_URI: <SET_ME>
- CUSTOM_USERNAME: <SET_ME>
- CUSTOM_HASHED_PASSWORD: <SET_ME>
- JWT_TOKEN: <SET_ME>
```
