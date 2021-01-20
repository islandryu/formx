---
id: overview
title: Overview
sidebar_label: Overview
---

FormX is a configuration based React form library.

The main idea behind it is to keep everything related to forms in one place:

- bussiness logic
- appearance of field components (labels, backgrounds...etc.)
- validation
- initial states
- transforming values from server to form
- transforming values from form to server
- ...etc

## Why?

Big forms (30+ fields) are hard to maintain.
Having everything related to your form in one place is great, instead of all your bussiness logic being scattered around a bunch of components.

## Concepts

### Context

Context is an object you pass to the `Form` component and it feeds your configuration with external dependencies.
This can be anything dynamic (or static) that you need for your form fields. Could be, for example:

- Bussiness object from the server
- Some state you have
- The t function from `react-i18next` for translating your labels, errors..etc.
- Redux dispatch
- ...etc

### Updating

FormX is very fast. Each field keeps track of it's own value and error, and we use imperative updating, so only what needs to be rendered, gets rendered.

### Transformation

Each fields configuration can define a `transform` function which will be called on submit so that in your `onSubmit` callback you get
the original values and transformed values.

### Deps

Deps are field names upon which your field depends on. Each time one of the fields in the array gets updated (value, error), that field gets updated too.
