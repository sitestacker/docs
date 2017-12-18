---
title: Webhooks
category: API
date: 2017-12-18 00:00:00
---

<aside style="float: right; border-radius: 5px; border: 1px solid #f0f4f7; border-left-width: 2px; width: 350px; padding: 0 16px 16px 16px; margin: 0 0 0 40px; position: relative; z-index: 2;     font-size: 95%; background-color: #fff;">
<h4>Webhook terminology</h4>
<p>An <i>event</i> is triggered when a certain action occurs in Site Stacker, such as a gift is made or a CRM record is updated. Each occurrence has a corresponding <b><code>Event</code></b> payload.</p>
<p><i>Webhook endpoints</i> are URLs defined by users to which Site Stacker sends events. A single event may be sent to many webhook endpoints.</p>
<p><i>Webhooks</i> refers to the overall concept of sending notifications to webhook endpoints.</p>
</aside>

Webhooks allow you to build or set up integrations which subscribe to certain events on a Site Stacker installation. When one of those events is triggered, we'll send a HTTP POST payload to the webhook's configured URL.

Webhooks can be installed in the **Webhooks** component in admin. Once installed, they will be triggered each time one or more subscribed events occur.

## Events

When configuring a webhook, you can choose which events you would like to receive payloads for. You can even [opt-in to all current and future events](#wildcard-event). Only subscribing to the specific events you plan on handling is useful for limiting the number of HTTP requests to your server. You can change the list of subscribed events through the Webhooks component anytime.

The available events are:

Name | Description
--- | ---
[*](#wildcard-event) | Any time any event is triggered ([Wildcard Event](#wildcard-event)).
[campaign_create](#campaign-create) | Any time a campaign is created.
[campaign_update](#campaign-update) | Any time a campaign is updated.
[campaign_delete](#campaign-delete) | Any time a campaign is deleted.
[contribution_batch_create](#contribution-batch-create) | Any time a contribution batch is created.
[contribution_batch_update](#contribution-batch-update) | Any time a contribution batch is updated.
[contribution_create](#contribution-create) | Any time a contribution is created.
[contribution_update](#contribution-update) | Any time a contribution is updated.
[person_create](#person-create) | Any time a person is created.
[person_update](#person-update) | Any time a person is updated.
[person_delete](#person-delete) | Any time a person is deleted.
[person_address_create](#person-address-create) | Any time an address is created.
[person_address_update](#person-address-update) | Any time an address is updated.
[person_address_delete](#person-address-delete) | Any time an address is deleted.
[person_email_create](#person-email-create) | Any time an email is created.
[person_email_update](#person-email-update) | Any time an email is updated.
[person_email_delete](#person-email-delete) | Any time an email is deleted.
[person_phone_create](#person-phone-create) | Any time a phone is created.
[person_phone_update](#person-phone-update) | Any time a phone is updated.
[person_phone_delete](#person-phone-delete) | Any time a phone is deleted.
[person_type_assign](#person-type-assign) | Any time a person type is assigned to a person.
[person_type_unassign](#person-type-unassign) | Any time a person type is unassigned from a person.
[tag_category_create](#tag-category-create) | Any time a tag category is created.
[tag_category_update](#tag-category-update) | Any time a tag category is updated.
[tag_category_delete](#tag-category-delete) | Any time a tag category is deleted.
[tag_create](#tag-create) | Any time a tag is created.
[tag_update](#tag-update) | Any time a tag is updated.
[tag_delete](#tag-delete) | Any time a tag is deleted.

## Payloads

Each event type has a specific payload format with the relevant event information. All event payloads are sent as json.

### Delivery headers

HTTP requests made to your webhook's configured URL endpoint will contain these special headers:

Header | Description
--- | ---
`SiteStacker-Event` | Name of the [event](#events) that triggered this delivery.
`SiteStacker-Signature` | HMAC hex digest of the payload, using the hook's secret as the key (if configured).
`SiteStacker-Delivery` | Unique ID for this delivery.

Also, the `User-Agent` for the requests will be `SiteStacker`.

### Deliveries

For each configured webhook you'll be able to inspect the deliveries (request and response) in the Webhook component, by right clicking your webhook and hitting "Deliveries".

### Failed Deliveries

If the response [HTTP status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for a delivery is not `2xx`, the delivery is considered failure and it will be retried 10 times at 1 minute intervals.

## Wildcard Event

Webhooks support a wildcard (`*`) that will match all supported events. When you add the wildcard event, we'll replace any existing events you have configured with the wildcard event and send you payloads for all supported events. You'll also automatically get any new events we might add in the future.

## Ping Event

When you create a new webhook, we'll send you a simple `ping` event to let you know you've set up the webhook correctly. You'll see this event in [Deliveries](#deliveries).

### Ping Event Payload

Key | Value
--- | ---
`hook` | The [webhook configuration](api#get-a-single-webhook)

## Campaign create

When a contribution campaign is created in Site Stacker, we'll send a `campaign_create` event.

The payload is the same as what you get when retrieving a campaign using the [`GET /campaigns/:id`](api#get-a-single-campaign) endpoint.

## Campaign update

When a contribution campaign is updated in Site Stacker, we'll send a `campaign_update` event.

The payload is the same as what you get when retrieving a campaign using the [`GET /campaigns/:id`](api#get-a-single-campaign) endpoint.

## Campaign delete

When a contribution campaign is deleted in Site Stacker, we'll send a `campaign_delete` event.

The payload is the same as what you get when retrieving a campaign using the [`GET /campaigns/:id`](api#get-a-single-campaign) endpoint.

## Contribution batch create

When a contribution batch is created in Site Stacker, we'll send a `contribution_batch_create` event.

The payload is the same as what you get when retrieving a contribution batch using the [`GET /contribution-batches/:id`](api#get-a-single-contribution-batch) endpoint.

## Contribution batch update

When a contribution batch is updated in Site Stacker, we'll send a `contribution_batch_update` event.

The payload is the same as the [contribution_batch_create](#contribution-batch-create).

## Contribution create

When a contribution is created in Site Stacker, we'll send a `contribution_create` event. Usually, you'll want to use the [`contribution_batch_create`](#contribution-batch-create) event instead of this one, since a contribution is always created along with a contribution batch.

The payload is the same as what you get when retrieving a contribution using the [`GET /contributions/:id`](api#get-a-single-contribution) endpoint.

## Contribution update

When a contribution is updated in Site Stacker, we'll send a `contribution_update` event.

The payload is the same as what you get when retrieving a contribution using the [`GET /contributions/:id`](api#get-a-single-contribution) endpoint.

## Person create

When a person is created in Site Stacker, we'll send a `person_create` event.

The payload is the same as what you get when retrieving a person using the [`GET /people/:id`](api#get-a-single-person) endpoint.

## Person update

When a person is updated in Site Stacker, we'll send a `person_update` event.

The payload is the same as what you get when retrieving a person using the [`GET /people/:id`](api#get-a-single-person) endpoint.

## Person delete

When a person is deleted in Site Stacker, we'll send a `person_delete` event.

The payload is the same as what you get when retrieving a person using the [`GET /people/:id`](api#get-a-single-person) endpoint.

## Person address create

When an address is created in Site Stacker, we'll send a `person_adress_create` event.

The payload is the same as what you get when retrieving an address using the [`GET /addresses/:id`](api#get-a-single-address) endpoint.

## Person address update

When an address is updated in Site Stacker, we'll send a `person_adress_update` event.

The payload is the same as what you get when retrieving an address using the [`GET /addresses/:id`](api#get-a-single-address) endpoint.

## Person address delete

When an address is deleted in Site Stacker, we'll send a `person_adress_delete` event.

The payload is the same as what you get when retrieving an address using the [`GET /addresses/:id`](api#get-a-single-address) endpoint.

## Person email create

When an email is created in Site Stacker, we'll send a `person_email_create` event.

The payload is the same as what you get when retrieving an email using the [`GET /emails/:id`](api#get-a-single-email) endpoint.

## Person email update

When an email is updated in Site Stacker, we'll send a `person_email_update` event.

The payload is the same as what you get when retrieving an email using the [`GET /emails/:id`](api#get-a-single-email) endpoint.

## Person email delete

When an email is deleted in Site Stacker, we'll send a `person_email_delete` event.

The payload is the same as what you get when retrieving an email using the [`GET /emails/:id`](api#get-a-single-email) endpoint.

## Person phone create

When a phone is created in Site Stacker, we'll send a `person_phone_create` event.

The payload is the same as what you get when retrieving a phone using the [`GET /phones/:id`](api#get-a-single-phone) endpoint.

## Person phone update

When a phone is updated in Site Stacker, we'll send a `person_phone_update` event.

The payload is the same as what you get when retrieving a phone using the [`GET /phones/:id`](api#get-a-single-phone) endpoint.

## Person phone delete

When a phone is deleted in Site Stacker, we'll send a `person_phone_delete` event.

The payload is the same as what you get when retrieving a phone using the [`GET /phones/:id`](api#get-a-single-phone) endpoint.

## Person relationship create

When a relationship is created in Site Stacker, we'll send a `person_relationship_create` event.

The payload is the same as what you get when retrieving a relationship using the [`GET /relationships/:id`](api#get-a-single-relationship) endpoint.

## Person relationship update

When a relationship is updated in Site Stacker, we'll send a `person_relationship_update` event.

The payload is the same as what you get when retrieving a relationship using the [`GET /relationships/:id`](api#get-a-single-relationship) endpoint.

## Person relationship delete

When a relationship is deleted in Site Stacker, we'll send a `person_relationship_delete` event.

The payload is the same as what you get when retrieving a relationship using the [`GET /relationships/:id`](api#get-a-single-relationship) endpoint.

## Person type assign

When a person type is assigned to a person record, we'll send a `person_type_assign` event. This event is useful if, for example, you want to be notified when a person becomes a donor.

The payload contains the `person_type` record and the `person` record, which contains all the data sent by the [`GET /people/:id`](api#get-a-single-person) endpoint.

```json
{
    "person_type": {
        "id": "18",
        "name": "Donor"
    },
    "person": {
        "...": "[ all the data of the GET /people/:id endpoint ]"
    }
}
```

## Person type unassign

When a person type is unassigned from a person, we'll send a `person_type_unassign` event.

The payload contains the `person_type` record and the `person` record, which contains all the data sent by the [`GET /people/:id`](api#get-a-single-person) endpoint.

```json
{
    "person_type": {
        "id": "18",
        "name": "Donor"
    },
    "person": {
        "...": "[ all the data of the GET /people/:id endpoint ]"
    }
}
```

## Tag category create

When a tag category is created in Site Stacker, we'll send a `tag_category_create` event.

The payload is the same as what you get when retrieving a tag category using the [`GET /tag-categories/:id`](api#get-a-single-tag-category) endpoint.

## Tag category update

When a tag category is updated in Site Stacker, we'll send a `tag_category_update` event.

The payload is the same as what you get when retrieving a tag category using the [`GET /tag-categories/:id`](api#get-a-single-tag-category) endpoint.

## Tag category delete

When a tag category is deleted in Site Stacker, we'll send a `tag_category_delete` event.

The payload is the same as what you get when retrieving a tag category using the [`GET /tag-categories/:id`](api#get-a-single-tag-category) endpoint.

## Tag create

When a tag is created in Site Stacker, we'll send a `tag_create` event.

The payload is the same as what you get when retrieving a tag using the [`GET /tags/:id`](api#get-a-single-tag) endpoint.

## Tag update

When a tag is updated in Site Stacker, we'll send a `tag_update` event.

The payload is the same as what you get when retrieving a tag using the [`GET /tags/:id`](api#get-a-single-tag) endpoint.

## Tag delete

When a tag is deleted in Site Stacker, we'll send a `tag_delete` event.

The payload is the same as what you get when retrieving a tag using the [`GET /tags/:id`](api#get-a-single-tag) endpoint.