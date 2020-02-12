<%- include('../partials/header') %>
<div class="container">
    <h1 style="text-align: center;">Edit Campground</h1>
    <div style="width: 30%; margin: 30px auto;">
        <form action="/campgrounds" method="POST">
            <div class="form-group">
                <input class="form-control" type="text" name="camapground[name]" value="<%=campground.name%>">
            </div>
            <div class="form-group">
                <input class="form-control" type="number" name="campground[price]" value="<%=campground.price%>" min="0.01" step="0.01">
            </div>
            <div class="form-group">
                <input class="form-control" type="text" name="campground[image]" placeholder="<%=campId.image%>">
            </div>
            <div class="form-group">
                <input class="form-control" type="text" name="campground[description]" placeholder="<%=campground.description%>">
            </div>
            <div class="form-group">
                <button class="btn btn-primary btn-lg btn-block">submit</button>
            </div>
        </form>
        <a href="/campgrounds">Main Page</a>
    </div>
</div>
<%- include('../partials/footer') %>
