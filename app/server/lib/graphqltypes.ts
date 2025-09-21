
export const dbType = `#graphql
    type Recipient {
    id: String,
    name: String,
    email: String,
    companyName: String,
    noOfEmailSent: Int
    userStatus:Boolean,
    industry: String,
    emailValid:Boolean
    isFirstMail:Boolean
    }

    type GetRecipientLenghts{
        AllRecipientLength:Int
    }


    type Query  {
    getRecipientLength:GetRecipientLenghts
    }

`

