# Migrating to TanStack Query (React Query)

## What Does the Migration Mean?

Currently, our application uses standard React hooks (`useState` and `useEffect`) combined with the `fetch` API to get data from the backend. 

**Our Current Approach (Manual):**
- We manually create state variables for `data`, `loading`, and `error`.
- We write `useEffect` hooks to trigger the fetch when the component mounts.
- If the user leaves the page and comes back, the app fetches the exact same data all over again, causing unnecessary loading spinners.

**The TanStack Query Approach:**
Migrating means replacing these manual setups with **TanStack Query** (formerly React Query). It is a specialized library designed to manage "server state" (data that comes from your backend).

## Why is this a massive upgrade?

By making this switch, we get enterprise-grade features out of the box with significantly less code:

1. **Automatic Caching:** Once data is fetched (e.g., the user's History), it is saved in memory. If they navigate away and come back, the data shows **instantly** without a loading screen.
2. **Background Refetching:** While displaying the cached data instantly, it silently checks the backend in the background to ensure the data is still fresh. 
3. **Drastically Less Code:** We can delete dozens of lines of `useState` and `useEffect` boilerplates. TanStack Query provides a simple `useQuery` hook that gives us `data`, `isLoading`, and `isError` automatically.
4. **Automatic Retries:** If the user's internet drops for a second or the server has a hiccup, TanStack Query will automatically retry the request before showing an error.
5. **Mutation Management:** For actions that change data (like uploading an audio file for prediction), it provides `useMutation` to easily track when the upload is pending, successful, or failed.

## Example Comparison

**Before Migration (Current):**
```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  api.getHistory()
    .then(res => setData(res))
    .catch(err => setError(err))
    .finally(() => setLoading(false));
}, []);
```

**After Migration:**
```jsx
const { data, isLoading, error } = useQuery({ 
  queryKey: ['history'], 
  queryFn: api.getHistory 
});
```

## Summary
Migrating to TanStack Query isn't about changing what the app does, it's about changing *how* it does it to make the app **faster, more reliable, and easier to maintain**.
